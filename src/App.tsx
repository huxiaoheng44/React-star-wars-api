import React from "react";
import CharactersTable from "./components/CharctersTable";
import StarWarsIcon from "./icons/StarWarsIcon";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

function App() {
  const [FavoriteMode, setFavoriteMode] = React.useState(false);
  const backgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/bg.png)`,
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
  };
  return (
    <div className="App">
      <header className="sticky top-0 z-10">
        <div className="text-white font-bold text-2xl bg-slate-700 px-5 flex flex-row">
          <div>
            <StarWarsIcon size={50} />
          </div>
          <div className="flex items-center px-5">
            Characters Reference Book
          </div>
          <div className=" flex flex-grow justify-end">
            {FavoriteMode ? (
              <HeartFilled onClick={() => setFavoriteMode(!FavoriteMode)} />
            ) : (
              <HeartOutlined onClick={() => setFavoriteMode(!FavoriteMode)} />
            )}
          </div>
        </div>
      </header>
      <div className="relative min-h-screen" style={backgroundStyle}>
        {/* <img
          className="absolute w-full h-full opacity-20"
          src={process.env.PUBLIC_URL + "/bg.png"}
          alt="background"
          style={{ zIndex: -1 }}
        /> */}
        <div className=" flex justify-center flex-col items-center content-center">
          <section className="max-w-screen-lg w-full">
            <CharactersTable FavoriteMode={FavoriteMode}></CharactersTable>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
