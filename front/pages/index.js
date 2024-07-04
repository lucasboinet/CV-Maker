import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthState } from '@/context/Auth';
import PageLayout from '@/components/Layout/PageLayout';

const Index = () => {
    const [projects, setProjects] = useState([]);
    const router = useRouter();
    const [{user},] = useAuthState();

    useEffect(() => {
        fetchProjects();
    }, [user])

    const createNewProject = async () => {
        if (user) {
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+'/projects', { user_id: user._id })
          .then((res) => {
            router.push(`/document/${res.data.id}`)
          })
          .catch((err) => console.error(err));
        }
    }

    const fetchProjects = async () => {
        if (user) {
            await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/projects/all/'+user._id)
                .then((res) => {
                    setProjects(res.data.projects);
                })
                .catch((err) => console.error(err));
        }
    }

    const loadProject = (id) => {
        router.push(`/document/${id}`)
    }
    
    const logout = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/auth/logout',{withCredentials:true});
            if (!res) return;
            router.push('/login');
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <PageLayout>
            <div className={styles.profile_container}>
                <div className={styles.create_button}>
                    <h3>Create new document ?</h3>
                    <button onClick={createNewProject}>Get started</button>
                    <button onClick={logout}>logout</button>
                </div>
                <h2>My documents</h2>
                <div className={styles.documents_list}>
                    {projects.map((project) => (
                        <div key={project._id} className={styles.document} onClick={() => loadProject(project._id)}>
                            {project.preview.length > 0 ? <img src={project.preview} alt="document preview" /> : <div className={styles.missing_preview}></div>}
                            <p>{project.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    )
}

export default Index;