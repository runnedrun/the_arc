In this project we use NextJS, firestore, firebase functions, and react, typescript and tailwind for styling

# Data

In the data folder, there is a file called CollectionModels, where we list all the "Models" which exist in our firestore database.
There is an type called AllModels which maps the name of a firebase collection to the typescript Type that represents the data stored in each record in that collection.

## Adding a new collection

Whenever we want to add a new collection, we add a new typescript type in it's own file in data/types, which always is wrapped by the "Model" type which includes shared fields like uid, archived, etc.
We then add the type to the AllModels type, as well as the collection name to the list called CollectionNames in the CollectionModels file.

# front end

## creating new pages

We use the next app folder.
When structuring page that are server side rendered with data from firebase, please follow the example of the "example" page in the app/example folder.

## writing data

To write data on the front end use the functions from the file "data/fb", which are structured as setters.<collectionName>("id", {data}) and creators.collectionName({data}). All setters already exist for all collections listed in CollectionModels.

## style
