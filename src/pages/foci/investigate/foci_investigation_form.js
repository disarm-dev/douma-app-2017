export default {
    "schema": {
        "type": "object",
        "required": false,
        "properties": {
            "email": {
                "type": "string",
                "required": false,
                "properties": {}
            },
            "password": {
                "type": "string",
                "required": false,
                "pattern": {},
                "properties": {}
            },
            "file": {
                "type": "string",
                "required": false,
                "properties": {}
            },
            "check": {
                "type": "boolean",
                "required": false,
                "default": true,
                "properties": {}
            }
        }
    },
    "options": {
        "focus": false,
        "type": "object",
        "helpers": [],
        "validate": true,
        "disabled": false,
        "showMessages": true,
        "collapsible": false,
        "legendStyle": "button",
        "fields": {
            "email": {
                "type": "text",
                "label": "Email Address",
                "helpers": [],
                "validate": true,
                "disabled": false,
                "showMessages": true,
                "renderButtons": true,
                "data": {},
                "attributes": {},
                "allowOptionalEmpty": true,
                "autocomplete": false,
                "disallowEmptySpaces": false,
                "disallowOnlyEmptySpaces": false,
                "fields": {}
            },
            "password": {
                "type": "password",
                "label": "not Password",
                "helpers": [],
                "validate": true,
                "disabled": false,
                "showMessages": true,
                "renderButtons": true,
                "data": {},
                "attributes": {},
                "allowOptionalEmpty": true,
                "autocomplete": false,
                "disallowEmptySpaces": false,
                "disallowOnlyEmptySpaces": false,
                "fields": {}
            },
            "file": {
                "type": "file",
                "label": "File Upload",
                "helpers": [],
                "validate": true,
                "disabled": false,
                "showMessages": true,
                "renderButtons": true,
                "data": {},
                "attributes": {},
                "allowOptionalEmpty": true,
                "autocomplete": false,
                "disallowEmptySpaces": false,
                "disallowOnlyEmptySpaces": false,
                "fields": {}
            },
            "check": {
                "type": "checkbox",
                "rightLabel": "Sign me up for the News Letter!",
                "label": "Newsletter",
                "helpers": [],
                "validate": true,
                "disabled": false,
                "showMessages": true,
                "renderButtons": true,
                "fields": {}
            }
        }
    },
    "data": {
        "email": "Jonathan Smith",
        "password": "MyPassword",
        "check": true
    }
}