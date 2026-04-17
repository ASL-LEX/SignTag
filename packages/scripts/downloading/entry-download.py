from argparse import ArgumentParser
from pathlib import Path
import logging
import os
import json


def main():
    parser = ArgumentParser('Utility to download entry videos/images from a GCP bucket')
    parser.add_argument('entries',
                        help='JSON file of entries to download')
    parser.add_argument('output',
                        help='Directory to store all of the entries')
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
    logging.debug(f'Found {len(entries)} number of entries to download')

if __name__ == '__main__':
    main()
