package com.petadoption.service;

import com.petadoption.model.BlogPost;

import java.util.List;

public interface BlogPostService {
    BlogPost createPost(BlogPost blogPost, Long userId);
    List<BlogPost> getAllPosts();
    List<BlogPost> getPostsByUser(Long userId);
    void deletePost(Long blogId);
}
