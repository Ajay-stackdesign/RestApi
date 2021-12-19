import express from "express";
import Mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const port  = process.env.PORT || 9002;
const connection_url = "mongodb://localhost:27017/sample"

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())


Mongoose.connect(connection_url, { useNewUrlParser: true , useUnifiedTopology: true})
.then(() => {
    console.log("connection is sucessfull")
}).catch((err) => {
    console.log(err.message)
})

const productSchehma = new Mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})

const Product = new Mongoose.model("product", productSchehma)

app.get("/",(req,res) =>{
    res.send("hello woeld")
})

app.post("/api/v1/product/new", async (req,res) => {
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

// read product 
app.get("/api/v1/product", async (req,res) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

app.put("/api/v1/product/:id", async (req,res) => {
    let product = await Product.findById(req.params.id)

    product = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        useFindAndModify: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        product
    })
})

app.delete("/api/v1/product/:id", async(req,res) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: true,
            message: "product not found"
        })
    }

    await product.remove();
    
    res.status(200).json({
        success: true,
        message: "product is deleted"
    })
})

app.listen(port, () => {
    console.log(`working on localhost: ${port}`)
})