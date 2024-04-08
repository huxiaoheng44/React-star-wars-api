import React from "react";
import CharactersTable from "./components/CharctersTable";

function App() {
  return (
    <div className="App">
      {/* <header >Star Wars Characters</header> */}
      {/* <Layout>
        <Header className="text-white font-bold text-3xl">
          <div className="">Star War Characters Reference Book</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content className="w-20 h-20 ">content</Content>
      </Layout> */}

      {/* {data &&
        data.allPeople.people.map((person: any) => (
          <div key={person.name}>
            <h2>{person.name}</h2>
            <p>Height: {person.height}</p>
            <p>Eye Color: {person.eyeColor}</p>
          </div>
        ))} */}
      <header className="sticky top-0 z-10">
        <div className="text-white font-bold text-2xl bg-slate-700 py-3 px-5 ">
          Star War Characters Reference Book
        </div>
      </header>
      <div className="relative min-h-screen">
        <img
          className="absolute w-full h-full opacity-20"
          src={process.env.PUBLIC_URL + "/bg.png"}
          alt="background"
          style={{ zIndex: -1 }}
        />
        <div className=" flex justify-center flex-col items-center content-center">
          <section className="max-w-screen-lg w-full">
            <CharactersTable></CharactersTable>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
