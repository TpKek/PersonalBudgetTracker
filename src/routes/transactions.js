import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
    res.json({ success : true, data :[]})
})

router.get("/:id", (req, res) => {
    res.json({ success : true, data :{}})
})

router.get('/user/:userId',(req,res) => {
    res.json({ success : true, data :[]})
})

router.post('/', (req, res) => {
    res.json({ success : true, data :{}})
})

router.patch('/:id/status', (req,res) => {
    res.json({ success : true, data :{}})
})
export default router
