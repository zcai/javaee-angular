package com.cortez.samples.javaee7angular.rest;

import com.cortez.samples.javaee7angular.data.User;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;

@Stateless
@ApplicationPath("/resources")
@Path("users")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class UserSource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public User findUser( @QueryParam("password") String password, @QueryParam("userId") String userId) {
    	System.out.println("findUser called------------------");
        Query query = entityManager.createQuery("SELECT u FROM User u where u.userId = '" + userId + "' and u.password = '" + password + "'");
        if (query.getResultList().size() == 0) {
        	return null;
        }
        System.out.println(query.getResultList().size() + "+++++++++++++++++");
        return (User)query.getResultList().get(0);
    }
    
    @GET
    @Path("{id}")
    public User getUser(@PathParam("id") String id) {
    	System.out.println("getUser called------------------");
       return entityManager.find(User.class, id);
    }

    @POST
    public void saveUser(User user) {
        if (user.getId() == null) {
        	User userToSave = new User();
        	userToSave.setUserId(user.getUserId());
        	userToSave.setPassword(user.getPassword());
            entityManager.persist(user);
        } else {
        	User userToUpdate = entityManager.find(User.class, user.getUserId());
        	user = entityManager.merge(userToUpdate);
        }
    }

    
    @DELETE
    @Path("{id}")
    public void deleteUser(@PathParam("id") String id) {
        entityManager.remove(getUser(id));
    }
}
