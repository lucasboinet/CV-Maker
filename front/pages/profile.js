import { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Profile = () => {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    await axios
      .get(process.env.NEXT_PUBLIC_SERVER_URL + '/projects')
      .then((res) => {
        setProjects(res.data.projects);
      })
      .catch((err) => console.error(err));
  };

  const loadProject = (id) => {
    router.push(`/document/${id}`);
  };

  const logout = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + '/auth/logout',
        { withCredentials: true }
      );
      if (!res) return;
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.profile_container}>
      <div className={styles.create_button}>
        <h3>Create new document ?</h3>
        <Link href="/document/0" passHref>
          <button>Get started</button>
        </Link>
        <button onClick={logout}>Logout</button>
      </div>
      <h2>My documents</h2>
      <div className={styles.documents_list}>
        {projects.map((project) => (
          <div
            key={project._id}
            className={styles.document}
            onClick={() => loadProject(project._id)}
          >
            <img src={project.preview} alt="document preview" />
            <p>{project.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
