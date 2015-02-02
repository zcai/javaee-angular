package com.cortez.samples.javaee7angular.rest;

import com.cortez.samples.javaee7angular.data.Person;
import com.cortez.samples.javaee7angular.data.Post;
import com.cortez.samples.javaee7angular.pagination.PaginatedListWrapper;
import com.cortez.samples.javaee7angular.pagination.PaginatedPostListWrapper;

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
@Path("posts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PostResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    private Integer countPosts() {
        Query query = entityManager.createQuery("SELECT COUNT(p.id) FROM Post p");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Post> findPosts(int startPosition, int maxResults, String sortFields, String sortDirections) {
        Query query =
                entityManager.createQuery("SELECT p FROM Post p ORDER BY p." + sortFields + " " + sortDirections);
        query.setFirstResult(startPosition);
        query.setMaxResults(maxResults);
        return query.getResultList();
    }
    
    private PaginatedPostListWrapper findPosts(PaginatedPostListWrapper wrapper) {
        wrapper.setTotalResults(countPosts());
        int start = (wrapper.getCurrentPage() - 1) * wrapper.getPageSize();
        wrapper.setList(findPosts(start,
                                    wrapper.getPageSize(),
                                    wrapper.getSortFields(),
                                    wrapper.getSortDirections()));
        return wrapper;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PaginatedPostListWrapper listPersons(@DefaultValue("1")
                                            @QueryParam("page")
                                            Integer page,
                                            @DefaultValue("id")
                                            @QueryParam("sortFields")
                                            String sortFields,
                                            @DefaultValue("asc")
                                            @QueryParam("sortDirections")
                                            String sortDirections) {
    	PaginatedPostListWrapper paginatedPostListWrapper = new PaginatedPostListWrapper();
    	paginatedPostListWrapper.setCurrentPage(page);
    	paginatedPostListWrapper.setSortFields(sortFields);
    	paginatedPostListWrapper.setSortDirections(sortDirections);
    	paginatedPostListWrapper.setPageSize(10);
        return findPosts(paginatedPostListWrapper);
    }

    @GET
    @Path("{id}")
    public Post getPost(@PathParam("id") Long id) {
        return entityManager.find(Post.class, id);
    }

    @POST
    public Post savePost(Post post) {
    	System.out.println("----------------------savePost called-----------------------");
        if (post.getId() == null) {
        	Post postToSave = new Post();
            postToSave.setTitle(post.getTitle());
            postToSave.setContent(post.getContent());
            postToSave.setUserId(post.getUserId());
            postToSave.setCategoryId(post.getCategoryId());
            entityManager.persist(post);
        } else {
        	Post postToUpdate = getPost(post.getId());
        	postToUpdate.setTitle(post.getTitle());
        	postToUpdate.setContent(post.getContent());
        	postToUpdate.setUserId(post.getUserId());
        	post = entityManager.merge(postToUpdate);
        }

        return post;
    }

    @DELETE
    @Path("{id}")
    public void deletePost(@PathParam("id") Long id) {
        entityManager.remove(getPost(id));
    }
}
