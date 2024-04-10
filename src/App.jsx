import { useState } from "react";
import "./App.css";

import { Pyodide } from "./pyodide";

const TEST_DATA = [
  [
    -0.24049124600404337, -39.99927704297411, -28.203897174230224,
    2.459881887698783, 25.849373356209398, -2.8126023818381327,
    -1.8414758265454658, 25.712808684371353, -0.9573841983781293,
    -9.899077764091523, 16.367147085191583, -36.0003943304004,
    10.723619178962625, 15.887882387797745, -31.076049769364598,
    -0.8199606292329413, 17.317946404214826, -113.55309518466673,
    -0.27942792392854265, 16.874755393721642, -95.91248969206308,
    2.116322964835888, 43.419835568728516, 26.96708505192356,
    1.1085501244378495, 45.78266206071851, 22.074805990354946,
    -7.4391958763927395, 42.21652044140098, -38.81299671223853,
    8.88214335241716, 41.6006910721691, -32.033433967742724,
    1.2963623356029466, 60.737781972943345, -86.58601013274317,
    0.8291222005093069, 62.65741745444014, -73.83768370170813,
    -1.1360348382668644, 2.1953415170943473, -65.56936562480614,
    2.0979998222831977, 1.6233159105275032, -61.68485940363557,
    -5.006798702522929, 100.75896089724998, -59.82964122017556,
    7.613265730643269, 102.63479261608174, -44.1862582658153,
    -1.1360348382668644, 2.1953415170943473, -65.56936562480614,
    2.0979998222831977, 1.6233159105275032, -61.68485940363557,
    -35.890455475084224, 0.4766880054723597, -0.48098249200814536,
    -17.961260487275744, 0.1262579041521832, 18.19946134046073,
    -15.26775853203008, -0.0025766919214766926, 4.44336206902765,
    -18.96903332767378, 2.489084396142168, 13.307182278892114,
  ],
];

const script = `
import json
from numpy import array
from pyodide.http import pyfetch
from pickle import loads as pickle_loads

async def load_file(file_path):
    response = await pyfetch(file_path)
    file_contents = await response.bytes()
    return file_contents

async def main():
	pickle = await load_file("model.pkl")
	
	test_data = array(${JSON.stringify(TEST_DATA)})
	res = pickle_loads(pickle).predict(test_data)
	print(json.dumps(res.tolist()))

main()
`;

function App() {
  const [pyprompt, setPyprompt] = useState(script);
  const [pyoutput, setPyoutput] = useState(null);
  const pyodide = Pyodide.getInstance(script);

  async function pyAsync() {
    pyodide.setOutput((text) => {
      setPyoutput(text);
    });
    console.log("clicked", pyprompt);
    await pyodide.run(pyprompt);
  }

  return (
    <>
      <h1>RFR from Pickle - WASM implementation</h1>
      <div>
        <textarea
          style={{
            width: "100%",
            height: "200px",
            fontFamily: "monospace",
            fontSize: "1rem",
            // To show - delete these rules
            visibility: "hidden",
            display: "none",
          }}
          value={pyprompt}
          onChange={(e) => {
            setPyprompt(e.target.value);
            console.log(e.target.value);
          }}
        ></textarea>

        <button
          onClick={() => {
            pyAsync();
          }}
        >
          Run
        </button>

        <p>Ouput:</p>
        <code>{pyoutput}</code>
      </div>
    </>
  );
}

export default App;
