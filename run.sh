#!/bin/bash

case "$(python --version 2>&1)" in
    *" 3."*)
        python -m http.server
        ;;
    *" 2.7."*)
		python -m SimpleHTTPServer 8000
		;;
    *)
        echo "Wrong Python version!"
        ;;
esac