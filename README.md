# SignTag

SignTag is a sign language focused data labeling platform. SignTag allows researchers to upload and annotate still images and videos with researcher defined fields. The labels can be made up of text, numeric, recorded videos, and uniquely identified sign language tokens (lexicon labeling). The ability to label data both with videos and with a sign lexicon allows sign language researchers to label sign language data with sign language, removing the frequently used approach of labeling with text of a spoken language.

<img src="./docs/assets/screenshot_with_signlex.png" width=750/>

## High Level Features

### Datasets

<img src="./docs/assets/screenshot_datasets.png" width=750 />

Datasets in SignTag provide you a way to create re-usable sets of videos and images for labeling. Datasets can be labeled multiple times and in different ways making it easy to repeat studies, extract additional features, or use your data in totally new studies. You can either upload existing data or record your own from within SignTag itself.

### Studies

<img src="./docs/assets/screenshot_video_recording_study.png" width=750 />

A "study" is a round of data labeling in the SignLex platform. As the researcher, you can select what data to label from your datasets. You can combine data from different datasets as well as label subsets of your datasets. You then select how you want the data labeled. This can be with text, numbers, but most commonly with video or lexicon labels. Shown above is a video being labeled with between 3-5 videos. Lexicon labeling shown at the top allows you to label videos with supported "Sign Lexicons" which are databases of uniquely identified signs for specific languages.

### Multiple Participants

SignTag is built around data collection and that includes the ability to collect from many different people. Built as a web application, participants can sign up for an account and researchers can then invite participants to take part in their studies. This enables data collection from a much wider audience and removes the need for participants to be co-located in order to get robust data collection.

### Data Exporting

SignTag is designed to be a collection platform and to not infringe on your ability to analyze the data as you see fit. As such, all of the data you collect and label within SignTag can be exported into easy to use formats. Video and image data is exported with well defined names in a zip file. Labels are exported in a CSV and reference back to the video and image file names found in the exported zip. 

## Running SignTag Yourself

SignTag is 