# A Game of Thrones LCG 2nd Edition Setup Analyzer

This provides some basic setup analysis for A Game of Thrones 2nd Edition.

This project was mostly done to learn Typescript/React. So as a result some things
are probably not done the best at the moment. I'm still working on improving
it overall.

Instructions for getting started developing:

```
npm install
```

Then build the application by typing
```
npm run build
```
This should compile the typescript assets into JS assets inside the `dist/` folder, 
and download/process the card-data from ThronesDB's public API.

To run locally type

```
npm run start
```

And hit `http://localhost:8080`

The current structure was mostly derived from here: https://github.com/tastejs/todomvc/tree/gh-pages/examples/typescript-react
Including many of the base css styling still being held over from that. 
