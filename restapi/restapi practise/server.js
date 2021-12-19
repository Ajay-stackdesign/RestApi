import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser";


const app = express();
const port = process.env.PORT || 8003
const connection_url = "mongodb://localhost:27017/smapleTest"


app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())


mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("connection successfull")
}).catch((err) => {
    console.log(err.message)
})


const workSchema = new mongoose.Schema({
    name: String,
    working: Boolean,
    salary: Number,
})

const Work = new mongoose.model("work", workSchema)


app.get("/",(req,res) => {
    res.status(200).json({
        "name": "ajay sahani",
        "student": true
    })
})

app.post("/api/v1/message", async (req,res) => {
    const working = await Work.create(req.body)

    res.status(201).json({
        success: true,
        message: "it working",
        working
    })
})

app.put("/api/v1/message/:id", async(req,res) => {
    let work = await Work.findById(req.params.id)

    work = await Work.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        useFindAndModify: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "success it working",
        work 
    })
})

app.delete("/api/v1/message/:id", async(req,res) => {
    const works = await Work.findById(req.params.id)

    if(!works){
        return res.status(500).json({
            success: true,
            message: "not working "
        })
    }
    await Work.remove();

    res.status(200).json({
        success: true,
        message: "finally did it"
    })
})




app.listen(port, () => {
    console.log(`listening to the localhost:${port}`)
})