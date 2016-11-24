# JS-IIS
a simple way to generate iis entries via command line

## Getting Started

1. Install globally
    ```js
    $ npm install -g js-iis
    ```
    
2. Create an .iisconfigrc file at the root of your project using JSON for your configuration

    ####Sample .iisconfigrc file

    ```json
    {
        "name": "Your Sample Site",
        "protocol": "http",
        "port": 80,
        "host": "your.site.int",
        "physicalPath": "C:\\path\\to\\your\\site",
        "appPool": {
            "runtime": "4.0",
            "pipeline": "classic",
            "processModel": {
                "identity": "LocalService"
            }
        },
        "subsites": {
            "type": "vdir",
            "name": "foo",
            "physicalPath": "C:\\path\\to\\your\\site\\foo",
            "subsites": {
                "type": "vdir",
                "name": "bar",
                "physicalPath": "C:\\path\\to\\your\\site\\bar"
            }
        }         
    }
    ```

3. Run JS-IIS

    To run individual tasks, use `iis <task>`. This can be either ```install``` or ```uninstall```


## Config Options

- ```name```: name of the site in IIS.
- ```protocol```: either ```'http'``` or ```'https'```. Defaults: `http`
- ```port```: numeric port number. Defaults: `80`
- ```host```: host header for the site to bind to.
- ```physicalPath```: physical root path of the site (ex: ```'C:\\path\\to\\your\\site'```).
- ```appPool```: (object) params for how to setup site's app pool.
    - ```runtime```: either ```'4.0'``` or ```'2.0'```. Defaults: `2.0`
    - ```pipeline```: either ```'Classic'``` or ```'Integrated'```. Defaults: `Integrated`
    - ```processModel```: (object) manage app pool's process model
        - ```identity```: (object|string) if set to string, will assume a built in account; if object, will assume a custom account and require username and password
            - ```username```
            - ```password```
- ```subsites```: (object) collection of applications or virtual directories to resides within site:
    - ```type```: either ```'vdir'``` or ```'app'```
    - ```name```: name of application or virtual directory
    - ```physicalPath```: physical root path of the application or virtual directory
    - ```subsites```: (object) collection of applications or virtual directories to resides within application or virtual directory, same as above