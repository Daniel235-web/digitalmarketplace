import { CollectionConfig } from "payload/types";// Import collectionConfig from payload

export const Users: CollectionConfig = {
  slug: "users", // Unique identifier for the collection
  auth: true, // Indicates if the collection requires authentication
  access: {
    read: () => true, // Determines if a user can read from the collection
    create: () => true,// Determinesif the user can create new records in the collections
  },
  fields: [            // an array of field configuration
    {
      name: "role",       // the name of the field
      defaultValue:"user",      // By default you should be a user 
      required: true,      // This will be required or else you can't proceed
      
      type: "select",     // the type of the field
      options: [      // the available options 
        { label: "Admin", value: "admin" },   // labels and value for options 
        { label: "User", value: "user" },    // labels and value for options
      ],
    },
  ],
};