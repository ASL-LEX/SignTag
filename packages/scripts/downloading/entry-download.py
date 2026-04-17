from argparse import ArgumentParser
from pathlib import Path
import logging
import os
import json
from google.cloud import storage


def main():
    parser = ArgumentParser('Utility to download entry videos/images from a GCP bucket')
    parser.add_argument('bucket',
                        help='GCP bucket where the entries are stored')
    parser.add_argument('entries',
                        help='JSON file of entries to download')
    parser.add_argument('output',
                        help='Directory to store all of the entries')
    parser.add_argument('--overwrite',
                        help='Will replace found files from bucket',
                        action='store_true')
    parser.add_argument('--log-level',
                        choices=logging._nameToLevel.keys(),
                        help='Log output level',
                        default='INFO',
                        required=False)

    args = parser.parse_args()

    # Setup logging
    logging.basicConfig(level=logging._nameToLevel[args.log_level])

    # Make sure the entry file exists
    entry_list_path = Path(args.entries)
    if not entry_list_path.exists():
        logging.error(f'Could not find entry files: {args.entries}')
        exit(1)

    # Next make sure the output folder exists
    entry_output_folder = Path(args.output)
    os.makedirs(entry_output_folder.absolute(), exist_ok=True)

    # Read in the entries to load
    with open(entry_list_path, 'r') as entry_list_file:
        entries = json.load(entry_list_file)['entries']
    logging.info(f'Found {len(entries)} number of entries to download')

    # Get the GCP storage client
    storage_client = storage.Client()
    bucket = storage_client.lookup_bucket(args.bucket)
    if bucket is None:
        logging.error(f'Could not get the bucket "{bucket}", please verify you are logged in and have the right bucket name')
        exit(1)
    logging.debug(f'Found bucket: {bucket.name}')

    # Now we can loop over all the entries
    for entry_key in entries:
        filename = Path(entry_key).name
        output_location = entry_output_folder / filename

        # Check if we should skip the given entry
        if output_location.exists() and args.overwrite == False:
            logging.info(f'Skipping {output_location}')
            continue

        # Otherwise we download the file
        blob = bucket.blob(entry_key)
        blob.download_to_filename(output_location.absolute())
        logging.info(f'Downloaded {output_location}')



if __name__ == '__main__':
    main()
