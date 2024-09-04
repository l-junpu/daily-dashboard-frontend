import "./project-header.css";

import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const ProjectHeader = () => {
  return (
    <div className="project-header-container">
      <button className="project-header-left-button">
        <FaAngleLeft />
      </button>
      <button className="project-header-right-button">
        <FaAngleRight />
      </button>
    </div>
  );
};

export default ProjectHeader;
