import React, { useRef, useState} from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

//   const url = 'https://jsonplaceholder.typicode.com/photos'
//   const[todos, setTodos] = useState()
//     const fetchApi = async () => {
//       const response = await fetch(url)
//       console.log(response.status)
//       const responseJSON = await response.json()
//       setTodos(responseJSON)
//     }
//     useEffect(() =>{
//       fetchApi()
//     }, [])



  const addMoveable = () => {
    const COLORS = ["red", "blue", "yellow", "green", "purple"];
    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true
      },
    ]);
  };

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
  

    const [handlePosX] = e.direction;

    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);


      // const initialLeft = e.left;
      // const initialWidth = e.width;

    }
  };

  return (




    <main style={{ height : "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "100%",
          width: "100%",
        }}
      >
        {/* <ul>
          {!todos? 'cargando...' :
          todos.map((todos,index) =>{
            return <li>{todos.url}</li>
          } )
          }
        </ul> */}

        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  color,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();
  
  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
    });
  };

//   const onResizeEnd = async (e) => {
//     let newWidth = e.lastEvent?.width;
//     let newHeight = e.lastEvent?.height;

//     const positionMaxTop = top + newHeight;
//     const positionMaxLeft = left + newWidth;

//     if (positionMaxTop > parentBounds?.height)
//       newHeight = parentBounds?.height - top;
//     if (positionMaxLeft > parentBounds?.width)
//       newWidth = parentBounds?.width - left;

//     const { lastEvent } = e;
//     const { drag } = lastEvent;
//     const { beforeTranslate } = drag;

//     const absoluteTop = top + beforeTranslate[1];
//     const absoluteLeft = left + beforeTranslate[0];

//     updateMoveable(
//       id,
//       {
//         top: absoluteTop,
//         left: absoluteLeft,
//         width: newWidth,
//         height: newHeight,
//         color,
//       },
//       true
//     );
//   };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable={true}
        draggable={true}
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width: e.width,
            height: e.height,
            color,
          });
        }}

        onResize={onResize}
        onResizeEnd={false}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
