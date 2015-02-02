package com.cortez.samples.javaee7angular.rest;

import com.cortez.samples.javaee7angular.data.Comment;
import com.cortez.samples.javaee7angular.pagination.CommentListWrapper;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * REST Service to expose the data to display in the UI grid.
 *
 * @author Roberto Cortez
 */
@Stateless
@ApplicationPath("/resources")
@Path("comments")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CommentResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    private Integer countComments() {
        Query query = entityManager.createQuery("SELECT COUNT(c.id) FROM Comment c");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Comment> findComments(Long postId) {
        Query query = entityManager.createQuery("SELECT c FROM Comment c where c.postId = " + postId);

        return query.getResultList();
    }
    
    private CommentListWrapper findComments(CommentListWrapper wrapper, Long postId) {
        wrapper.setTotalResults(countComments());
        wrapper.setList(findComments(postId));
        //System.out.println(wrapper.getList().size() + "----------------------");
        return wrapper;
    }

    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public CommentListWrapper listComments(@QueryParam("postId") Long postId) {
    	//System.out.println(postId);
    	CommentListWrapper commentListWrapper = new CommentListWrapper();
        return findComments(commentListWrapper, postId);
    }
    
    @GET
    @Path("{id}")
    public Comment getComment(@PathParam("id") Long id) {
        return entityManager.find(Comment.class, id);
    }

    @POST
    public Comment saveComment(Comment comment) {
        if (comment.getId() == null) {
        	Comment commentToSave = new Comment();
        	commentToSave.setPostId(comment.getPostId());
        	commentToSave.setContent(comment.getContent());
        	commentToSave.setUserId(comment.getUserId());
        	commentToSave.setCommentTime(new java.util.Date());
            entityManager.persist(commentToSave);
        	System.out.println("xxxxxxxxxxxxxxxxxxxxxxxxx"+commentToSave.getCommentTime());
        } else {
        	Comment commentToUpdate = getComment(comment.getId());
        	commentToUpdate.setPostId(comment.getPostId());
        	commentToUpdate.setContent(comment.getContent());
        	commentToUpdate.setUserId(comment.getUserId());
        	comment = entityManager.merge(commentToUpdate);
        }
        //should return commentToSave or commentToUpdate
        return comment;
    }

    @DELETE
    @Path("{id}")
    public void deleteComment(@PathParam("id") Long id) {
        entityManager.remove(getComment(id));
    }
}
