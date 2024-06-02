import { request, gql } from "graphql-request";

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = "http://localhost:4000/graphql";

// --- reviews -----------------------------------------------------------------------------------
async function getReview() {
    const query = gql`
    query Reviews { 
    reviews {
      id
      content
      isDeleted
      flagged
      user {
        id
        email
        isBlocked
      }
      product {
        id
        name
        description
        price
        category
        originalPrice
        validFrom
        validTo
      }
    }
  }
  `;

    const data = await request(GRAPH_QL_URL, query);
    
    return data.reviews;
}

async function deleteReview(id) {
    const query = gql`
   mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      id
      isDeleted
    }
  }
  `;

    const variables = { id };

    const data = await request(GRAPH_QL_URL, query, variables);
    return data.reviews;
}


export {
    getReview,deleteReview
}
