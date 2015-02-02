package com.cortez.samples.javaee7angular.rest;

import com.cortez.samples.javaee7angular.data.Category;
import com.cortez.samples.javaee7angular.pagination.CategoryListWrapper;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.*;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import java.util.List;


@Stateless
@ApplicationPath("/resources")
@Path("categories")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class CategoryResource extends Application {
    @PersistenceContext
    private EntityManager entityManager;

    private Integer countCategories() {
        Query query = entityManager.createQuery("SELECT COUNT(c.id) FROM Category c");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Category> findCategories() {
        Query query = entityManager.createQuery("SELECT c FROM Category c");
        return query.getResultList();
    }
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public CategoryListWrapper listCategories() {
    	CategoryListWrapper categoryListWrapper = new CategoryListWrapper();
    	categoryListWrapper.setTotalResults(countCategories());
    	categoryListWrapper.setList(findCategories());
        return categoryListWrapper;
    }
    
    @GET
    @Path("{id}")
    public Category getCategory(@PathParam("id") Long id) {
        return entityManager.find(Category.class, id);
    }

    @POST
    public void saveCategory(Category category) {
        if (category.getId() == null) {
        	Category categoryToSave = new Category();
        	categoryToSave.setCategoryName(category.getCategoryName());
            entityManager.persist(categoryToSave);
        } else {
        	Category categoryToUpdate = getCategory(category.getId());
        	categoryToUpdate.setCategoryName(category.getCategoryName());
        }
    }

    @DELETE
    @Path("{id}")
    public void deleteCategory(@PathParam("id") Long id) {
        entityManager.remove(getCategory(id));
    }
}
