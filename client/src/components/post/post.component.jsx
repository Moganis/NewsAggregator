import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import Spinner from "../layout/spinner.component";
import PostItem from "../posts/posts-item.component";
import CommentForm from "../comments/comment-form.component";
import CommentItem from "../comments/comment-item.component";

import { getPost } from "../../redux/reducers/posts/posts.actions";

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, []);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" classname="btn">
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      {post.comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} postId={post._id} />
      ))}
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
