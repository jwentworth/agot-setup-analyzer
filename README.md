# A Game of Thrones LCG 2nd Edition Setup Analyzer

This provides some basic setup analysis for A Game of Thrones 2nd Edition.

This project was mostly done to learn Typescript/React. So as a result some things
are probably not done the best at the moment. I'm still working on improving
it overall.

Instructions for getting started developing:

```
npm install
```

If you don't already have gulp
```
npm install -g gulp
```

Then compile assets by tping
```
gulp
```

This should compile the typescript assets into JS assets inside of the dist/ folder, as well as compile the card data into a single file.

To run locally

```
python -m SimpleHTTPServer
```

And hit localhost:8000

The current structure was mostly derived from here: https://github.com/tastejs/todomvc/tree/gh-pages/examples/typescript-react
Including many of the base css styling still being held over from that. 
