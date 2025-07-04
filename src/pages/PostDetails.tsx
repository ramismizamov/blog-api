import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosApi from '../axiosApi';
import { IPost } from '../types';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';

export const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');

  useEffect(() => {
    axiosApi.get<IPost>(`/posts/${id}/`)
      .then(res => setPost(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    await axiosApi.delete(`/posts/${id}/`);
    navigate('/posts');
  };

  if (loading) return <CircularProgress />;
  if (!post) return <Typography>Post not found</Typography>;

  return (
    <Container>
      <Typography variant="h4">{post.title}</Typography>
      <Typography variant="subtitle1">Category: {post.category}</Typography>
      <Typography variant="subtitle2">Author: {post.author}</Typography>
      <Typography variant="body1">{post.content}</Typography>
      {post.extra_info && <Typography color="textSecondary">Extra: {post.extra_info}</Typography>}
      {isAuthenticated && (
        <>
          <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={() => navigate(`/edit-post/${post.id}`)}>Edit</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </>
      )}    
    </Container>
  );
};