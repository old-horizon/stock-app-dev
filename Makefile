ROOT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

build-frontend:
	npm --prefix $(ROOT_DIR)/frontend run build

copy-css:
	echo '<style>' > $(ROOT_DIR)/backend/build/stylesheet.html && \
	cat $(ROOT_DIR)/frontend/public/build/bundle.css >> $(ROOT_DIR)/backend/build/stylesheet.html && \
	echo '</style>' >> $(ROOT_DIR)/backend/build/stylesheet.html

copy-js:
	echo '<script>' > $(ROOT_DIR)/backend/build/javascript.html && \
	cat $(ROOT_DIR)/frontend/public/build/bundle.js >> $(ROOT_DIR)/backend/build/javascript.html && \
	echo '</script>' >> $(ROOT_DIR)/backend/build/javascript.html

build-backend:
	npm --prefix $(ROOT_DIR)/backend run build

build: build-frontend copy-css copy-js build-backend

deploy:
	npm --prefix $(ROOT_DIR)/backend run deploy
