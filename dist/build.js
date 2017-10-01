var x ={
    "test-component": {
        "tpl": {
            "children": [
                {
                    "attributes": {
                        "title": "hmm",
                        "propDop": "asdasd"
                    },
                    "children": [
                        {
                            "attributes": {},
                            "children": [
                                {
                                    "attributes": {},
                                    "children": [],
                                    "tag": "textNode",
                                    "html": "{{name}} ist {{alter}} jahre alt"
                                }
                            ],
                            "tag": "p"
                        }
                    ],
                    "tag": "div"
                }
            ]
        },
        "data": {
            "person": {
                "name": "milad",
                "alter": "30",
                "erfolge": {
                    "erfolg": "aaaa"
                }
            }
        },
        "interface": {
            "person": {
                "type": "array",
                "items": {
                    "erfolge": {
                        "type": "array",
                        "items": {
                            "erfolg": {
                                "type": "string",
                                "value": "aaaa"
                            }
                        }
                    }
                }
            }
        }
    }
}