import skip from "./skip.png";
import rank from "./Rank.png";
import correct from "./Right.png";
import incorrect from "./X.png";
import time from "./Time.png";
import marks from "./File.png";

const style = {
  width: "20%"
}

export const result_images = {
  Rank: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={rank} /></div>,
  Correct: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={correct} /></div>,
  Incorrect: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={incorrect} /></div>,
  Skipped: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={skip} /></div>,
  Time_Taken: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={time} /></div>,
  Marks: <div className="ResultPageImages"> <img  draggable="false" style={ style } src={marks} /></div>,
};
