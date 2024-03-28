import { useEffect, useState } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CiClock2 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TiHome } from "react-icons/ti";
import { FaStar } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";

function App() {
  const todosArray = [
    {
      id: "1",
      title: "todo1",
      status: "Things To Do",
    },
    {
      id: "2",
      title: "todo2",
      status: "Doing",
    },
    {
      id: "3",
      title: "todo2",
      status: "Done",
    },
  ];
  const [todos, setTodos] = useState(todosArray);
  console.log(todos, "hjhs");

  // const [boards, setBoards] = useState(["Things To Do", "Doing", "Done"]);
  const [boards, setBoards] = useState([
    { name: "Things To Do", size: "medium" },
    { name: "Doing", size: "medium" },
    { name: "Done", size: "medium" },
  ]);

  const [hidden, setHidden] = useState(false);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [boardSize, setBoardSize] = useState("medium");

  const handleHidden = () => {
    setHidden(!hidden);
  };

  const handleAddCard = (board) => {
    setActiveBoard(board);
    setHidden(false);
  };

  const handleInputChange = (e) => {
    setNewTodoTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newTodoTitle.trim() !== "") {
      const newTodo = {
        id: (todos.length + 1).toString(),
        title: newTodoTitle.trim(),
        status: activeBoard,
      };
      console.log(newTodo);
      setTodos([...todos, newTodo]);
      window.localStorage.setItem("todos", JSON.stringify(todos));
      setNewTodoTitle("");
      setHidden(true);
    }
  };

  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const items = Array.from(todos);
      const [reordereditem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reordereditem);
      setTodos(items);
      window.localStorage.setItem("todos", JSON.stringify(items));
      return;
    } else {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === result.draggableId) {
          return {
            ...todo,
            status: destination.droppableId,
          };
        }
        return todo;
      });
      setTodos(updatedTodos);
      window.localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  };
  function capital_letter(str) {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
  }

  const handleCreateButton = (e) => {
    e.preventDefault();
    console.log(boardSize, "sixe");
    setBoards([...boards, { name: "New Board", size: boardSize || "medium" }]);
  };

  useEffect(() => {
    let temp = JSON.parse(window.localStorage.getItem("todos"));
    if (temp) {
      setTodos(temp);
    }
    // let tempBoards = JSON.parse(window.localStorage.getItem("boards"));
    // if (tempBoards) {
    //   setBoards(tempBoards);
    // }
  }, [boards]);

  return (
    <>
      <header className="header d-flex justify-content-between align-items-center">
        <div className="header d-flex justify-content-between align-items-center">
          <BsThreeDotsVertical />
          <div className="home">
            <TiHome />
          </div>
          <div className="star">
            <FaStar />
          </div>
          Thriving Technologies
        </div>
        <div className="header d-flex justify-content-between align-items-center gap-2">
          <div className="notification">
            <IoIosNotifications />
          </div>

          <form onSubmit={handleCreateButton}>
            <input
              hidden={true}
              type="radio"
              name="size"
              id="small"
              value="small"
              onChange={() => setBoardSize("small")}
            />
            <label htmlFor="small">small</label>
            <input
              hidden
              type="radio"
              name="size"
              id="medium"
              value="medium"
              onChange={() => setBoardSize("medium")}
            />
            <label htmlFor="medium">medium</label>
            <input
              hidden
              type="radio"
              name="size"
              id="large"
              value="large"
              onChange={() => setBoardSize("large")}
            />
            <label htmlFor="large">large</label>
            <button type="submit" disabled={boards.length > 3}>
              Create New Board
            </button>
          </form>
        </div>
      </header>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="boards-div">
          {boards.map((board) => (
            <div className={"board " + board.size} key={board.name}>
              <h4>{capital_letter(board.name)}</h4>
              <Droppable droppableId={board.name} key={board.name}>
                {(provided) => (
                  <div
                    className="h-100"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {todos.map(
                      (todo, index) =>
                        todo.status === board.name && (
                          <Draggable
                            key={todo.id}
                            draggableId={todo.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="item"
                                key={todo.title}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                <p>{todo.title}</p>
                                <p>
                                  <span>
                                    <CiClock2 />
                                  </span>
                                  12 Jan
                                </p>
                              </div>
                            )}
                          </Draggable>
                        )
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <input className="addTask"
                type="text"
                hidden={hidden || activeBoard !== board.name}
                onBlur={handleHidden}
                value={newTodoTitle}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <p
                className="add-button"
                onClick={() => handleAddCard(board.name)}
              >
                + Add another card
              </p>
            </div>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
