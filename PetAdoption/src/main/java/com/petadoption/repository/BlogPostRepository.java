package com.petadoption.repository;

import com.petadoption.model.BlogPost;
import com.petadoption.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByAuthor(User author);
}
