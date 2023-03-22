import { useState } from "react";
import Utils from "./Utils";
import Togglable from "./Togglable";

const Input = Utils.Input;

const CreateBlogBody = ({ onToggle, onCreate }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createBlog = async (event) => {
    event.preventDefault();
    setTitle("");
    setAuthor("");
    setUrl("");
    onCreate(title, author, url);
  };

  //console.log('create blog states', title, author, url);

  return (
    <div id="createBlogForm">
      <h2>create new</h2>
      <div>
        title:
        <Input id="titleInp" inpState={[title, setTitle]} type="text" />
      </div>
      <div>
        author:
        <Input id="authorInp" inpState={[author, setAuthor]} type="text" />
      </div>
      <div>
        url:
        <Input id="urlInp" inpState={[url, setUrl]} type="text" />
      </div>
      <button id='create-blog-btn' onClick={createBlog}>create</button>
      <div>
        <button onClick={onToggle}>cancel</button>
      </div>
    </div>
  );
};

const Header = ({ onToggle }) => <button onClick={onToggle}>new note</button>;
const CreateBlog = ({ onCreate, visbilityState }) => {
  //console.log('Create blog re-render');  
  return (
    <Togglable header={<Header />} >
      <CreateBlogBody onCreate={onCreate} />
    </Togglable>
  );
};

export default CreateBlog;
