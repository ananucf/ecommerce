import { connect } from "mongoose";

export const dbConn = connect('mongodb+srv://anan22:eMn9rcWkJGyfqVq0@cluster0.xoeue.mongodb.net/ecommerce')
    .then(() => {
        console.log('Database connected');
    }).catch(() => {
        console.log('database error');

    })


//anan22
//eMn9rcWkJGyfqVq0