import express, {Request, Response} from 'express';
import Project from '../models/Project';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

router.post('/', (req: Request, res: Response) => {
    const { user_id } = req.body;

    const project = new Project({
        user_id,
        name: "New Document",
        preview: "",
        body: ""
    })

    project.save()
        .then((pro: any) => res.status(200).json({id: pro._id, success: true}))
        .catch((err: any) => res.status(400).json({success: false, err: err.message}));
})

router.get('/all/:userid', (req: Request, res: Response) => {
    const { userid } = req.params;

    Project.find({user_id: userid})
        .then((projects: any) => {
            res.status(200).json({projects, success: true})
        })
        .catch((err: any) => res.status(400).json({success: false}))
})

router.get('/:id', (req: Request, res: Response) => {
    const project_id = req.params.id;

    Project.findOne({_id: project_id})
        .then((project: any) => {
            res.status(200).json({project, success: true})
        })
        .catch((err: any) => res.status(400).json({success: false}))
})

router.post('/update', (req: Request, res: Response) => {
    const project_id = req.body.id;
    const items = req.body.items;

    Project.updateOne({_id: project_id}, { body: JSON.stringify(items) })
        .then(() => {
            res.status(200).json({success: true})
        })
        .catch((err: any) => res.status(400).json({success: false}))
})

router.post('/images', (req: Request, res: Response) => {
    const file = req.files!.file;
    const { id, folder, ext, updatePreview } = req.body;

    cloudinary.uploader.upload_stream({ folder, resource_type: 'image', public_id: `${id}${ext}` }, (err, result) => {
        if (err) return res.status(500).json({success: false, err});

        if (updatePreview) {
            Project.updateOne({ _id: id }, { preview: result?.secure_url })
            .then(() => res.status(200).json({success: true, url: result?.secure_url}))
            .catch((err) => res.status(400).json({success: false, err}));
        } else {
            return res.status(200).json({success: true, url: result?.secure_url});
        }
    })

    // @ts-ignore
    .end(file.data);
})

router.post('/images/delete', (req: Request, res: Response) => {
    const { id, folder } = req.body;
    console.log("DELETE", req.body);
    cloudinary.uploader.destroy(`${folder}/${id}`, (err, result) => {
        if (err) return res.status(500).json({success: false, err});
        return res.status(200).json({success: true});
    })
})

export default router;