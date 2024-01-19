import { Access, CollectionConfig } from "payload/types";

const yourOwn: Access = ({req: {user}}) => {// function to read all the orders if you an admin
   if(  user.role === "admin") return true

   return {
    user: {
        equals: user?.id,
    },
   }
}

export const Orders: CollectionConfig = {
    slug: "orders",
    admin: {
        useAsTitle: "Your Oders",
        description: " A summary of all your orders on Digital Market",

    },
    access: {
        read: yourOwn,// you can only reas your own oders
        update: ({req}) => req.user.role === "admin" , // only admin users can update this
        delete: ({req}) => req.user.role === "admin" , // only admin users can delete this
        create: ({req}) => req.user.role === "admin",  // only admin users can create this
    },
    fields: [
        {
            name: '_isPaid',
            type: 'checkbox',
            access: {
                read: ({req}) => req.user.role === 'admin',
                create: () => false,// nobody can create this field unless through code 
                update: () => false,// nobody can update this field unless through code
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
           name: 'user',
           type: 'relationship',
           admin: {
            hidden: true,

           },
           relationTo: "users",
           required: true,


        },
        {
            name: 'products',
            type: 'relationship',
            relationTo: 'products',
            required: true,
            hasMany: true,
        },

    ],
}