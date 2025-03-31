import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BlogPost } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const BlogModule: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAppContext();
  
  // State for new/edited post
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // State for filter
  const [filterTag, setFilterTag] = useState<string | null>(null);
  
  // Ref for the editor
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setEditMode(false);
    setCurrentPostId(null);
    setShowEditor(false);
  };
  
  // Load post for editing
  const editPost = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags.join(', '));
    setEditMode(true);
    setCurrentPostId(post.id);
    setShowEditor(true);
    
    // Scroll to editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }, 100);
  };
  
  // Handle post submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags (split by commas and trim whitespace)
    const tagList = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    if (editMode && currentPostId) {
      // Update existing post
      const updatedPost: BlogPost = {
        id: currentPostId,
        title,
        content,
        tags: tagList,
        createdAt: blogPosts.find(post => post.id === currentPostId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updateBlogPost(updatedPost);
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: uuidv4(),
        title,
        content,
        tags: tagList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addBlogPost(newPost);
    }
    
    // Reset form after submission
    resetForm();
  };
  
  // Handle post deletion
  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteBlogPost(postId);
      
      // If the deleted post was being edited, reset the form
      if (currentPostId === postId) {
        resetForm();
      }
    }
  };
  
  // Toggle the editor visibility
  const toggleEditor = () => {
    setShowEditor(!showEditor);
    if (!showEditor) {
      // Reset form when opening
      setEditMode(false);
      setCurrentPostId(null);
      setTitle('');
      setContent('');
      setTags('');
      
      // Scroll to editor when opening
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
  // Get all unique tags from all posts
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  
  // Filter posts by tag if a filter is selected
  const filteredPosts = filterTag 
    ? blogPosts.filter(post => post.tags.includes(filterTag))
    : blogPosts;
    
  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blog-module">
      <header className="module-header">
        <h2>Blog</h2>
        <button onClick={toggleEditor} className="write-post-btn">
          {showEditor ? "Cancel" : <><FontAwesomeIcon icon={faPenToSquare} /> Write New Post</>}
        </button>
      </header>
      
      <div className="blog-content">
        <div className="blog-sidebar">
          <div className="blog-tags-filter">
            <h3>Filter by Tag</h3>
            <div className="tags-list">
              <button 
                className={`tag-button ${filterTag === null ? 'active' : ''}`}
                onClick={() => setFilterTag(null)}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag}
                  className={`tag-button ${filterTag === tag ? 'active' : ''}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="blog-main">
          {showEditor && (
            <div className="blog-editor card" ref={editorRef}>
              <h3>{editMode ? 'Edit Post' : 'Create New Post'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="post-title">Title</label>
                  <input 
                    type="text"
                    id="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="post-content">Content</label>
                  <textarea 
                    id="post-content"
                    ref={contentRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={6}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="post-tags">Tags (comma separated)</label>
                  <input 
                    type="text"
                    id="post-tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. thoughts, ideas, inspiration"
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    {editMode ? 'Update Post' : 'Create Post'}
                  </button>
                  <button 
                    type="button" 
                    className="secondary-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="blog-posts">
            <h3 className="blog-posts-heading">
              {filterTag ? `Posts tagged with "${filterTag}"` : 'All Posts'}
              <span className="post-count">({sortedPosts.length})</span>
            </h3>
            
            {sortedPosts.length === 0 ? (
              <div className="empty-posts-message card">
                {filterTag
                  ? `No posts found with the tag "${filterTag}".`
                  : 'No blog posts yet. Create your first post!'}
                  
                {!filterTag && !showEditor && (
                  <button 
                    onClick={toggleEditor} 
                    className="create-first-post-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Create First Post
                  </button>
                )}
              </div>
            ) : (
              sortedPosts.map(post => (
                <article key={post.id} className="blog-post card">
                  <header className="post-header">
                    <div className="post-title-container">
                      <h4 className="post-title">{post.title}</h4>
                      <div className="post-meta">
                        <span className="post-date">
                          {formatDate(post.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="post-action-btn edit-btn"
                        onClick={() => editPost(post)}
                        aria-label="Edit post"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button 
                        className="post-action-btn delete-btn"
                        onClick={() => handleDelete(post.id)}
                        aria-label="Delete post"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </header>
                  
                  <div className="post-content">
                    {post.content.split('\n').map((paragraph, index) => (
                      paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                    ))}
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map(tag => (
                        <button 
                          key={tag} 
                          className="post-tag"
                          onClick={() => setFilterTag(tag)}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModule; 