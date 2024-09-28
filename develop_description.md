In this project we use NextJS, firestore, firebase functions, and react and typescript.

# Data
In the data folder, there is a file called CollectionModels, where we list all the "Models" which exist in our firestore database. 
There is an type called AllModels which maps the name of a firebase collection to the typescript Type that represents the data stored in each record in that collection.

## Adding a new collection
Whenever we want to add a new collection, we add a new typescript type in it's own file in data/types, which always is wrapped by the "Model" type which includes shared fields like uid, archived, etc. 
We then add the type to the AllModels type, as well as the collection name to the list called CollectionNames in the CollectionModels file.
