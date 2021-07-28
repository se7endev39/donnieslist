# Donny's List

## Fetch Source Code

```
git clone https://<username>@bitbucket.org/donnydey/donnies-list.git
```

## Database Installation

If you want to delete the your existng db 
```bash
mongo donnyslist --eval "db.dropDatabase()"
```

To populate the DB
```bash
mongorestore -d donnyslist db/
```

## Packages installation

```
./install.sh
```

## Usage

```
./runall.sh
```

Hit this url on browser : http://0.0.0.0:5000/
