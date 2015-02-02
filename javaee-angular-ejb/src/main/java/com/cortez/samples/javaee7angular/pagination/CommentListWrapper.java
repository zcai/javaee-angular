package com.cortez.samples.javaee7angular.pagination;

import com.cortez.samples.javaee7angular.data.Comment;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.List;

@XmlRootElement
public class CommentListWrapper implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    private Integer totalResults;

    @XmlElement
    private List<Comment> list;



    public Integer getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(Integer totalResults) {
        this.totalResults = totalResults;
    }



    public List<Comment> getList() {
        return list;
    }

    public void setList(List<Comment> list) {
        this.list = list;
    }
}
