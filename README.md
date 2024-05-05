# Sort by Category

This project has the sole and exclusive purpose of satisfying my laziness when looking for a project that I have done in the past, by having it organized by shortcuts in a special folder, I can consult them quickly and efficiently.

## Explain

### Symbolic register of folders

`sbc.ts`

Folder shortcuts are made using a Node function, this is `fs.symlinkSync(item, symlinkPath)`.

### Environment variables

`.env` `.env.sample`

```bash
SBC_SOURCE_FOLDER=""
SBC_DESTINATION_ROUTE=""
SBC_IGNORE_FOLDERS=""
```

The routes to ignore, must be prepared with a `,`.

### Create target directories

For the magic to work, in `SBC_DESTINATION_ROUTE` there has to be a file called `.rules` in each category subfolder, they have to have this basic structure:

```bash
/
  angular.json

package.json
  /@angular\/\w+\s+("|')(.*?)\1/g
```

`/`: When it starts with `/` it means that it will look for a file in the directory provided after the /. 

`package.json`: When it is a file, it means that you are going to search inside the file using the provided regular expression.

You can play with that, if it works, fine, if not, also.

## Built

This project was created using `bun` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

![Built techs](https://skillicons.dev/icons?i=ts,bun&theme=dark)

> Icons: [https://skillicons.dev/](https://skillicons.dev/)