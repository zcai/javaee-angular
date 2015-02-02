package com.cortez.samples.javaee7angular.pagination;

import com.cortez.samples.javaee7angular.data.Category;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

@XmlRootElement
public class CategoryListWrapper implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    private Integer totalResults;

    @XmlElement
    private List<Category> list;



    public Integer getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(Integer totalResults) {
        this.totalResults = totalResults;
    }



    public List<Category> getList() {
        return list;
    }

    public void setList(List<Category> list) {
        this.list = list;
    }
}
