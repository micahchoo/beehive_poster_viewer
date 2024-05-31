All the source code for the online viewer are in a git repository, hosted on github at:
https://github.com/jrochkind/beehive_poster_viewer

This includes HTML, JS, CSS, and scene definitions in XML. It does NOT include the tile images in the `./tiles` directory -- those are too large to be kept in the repo, and are just manually uploaded to the ./tiles directory on the web server. 

This repo is viewable by the public at large; the code is open source.

A git repository, among other things, keeps track of all changes made to the files, easily allows you see what changes were made when, undo changes, etc.

So, it would be best to make changes *only through git*, not edit them directly on the web server. There are a variety of ways to use git, but the easiest for the non-techies might be using the built-in web editor on github.com -- just go to the file you want, and click 'edit', then 'save' (entering a short summary of the nature/purposes of your changes in the text box given for that is advisable)

To see the 'edit' button and be able to edit, you'll have to make an account on github.


## be careful; and more advanced use: branches

The danger of simply making changes in github and then pulling them, is you don't see for sure if they've worked (or if they may break everything) until you've made your changes live. 

So be careful!

There are features in git that would allow you to make your changes on a separate 'branch', and only later after you've confirmed they work, merge them into the 'master' branch. How woud you test your branch to see if it worked? You could check out another version of the posterViewer somewhere else on the web server (say posterViewer_test), and examine it there. 

Full instructions on how to do that we can't get into now -- and we'd probably have to figure out a scheme for making sure the posterViewer_test area can find the tile images properly (if you are a techie reading this, symlinks might be worth exploring). So this is really just an idea for possible future exploration for now. 

## github pages
Under .github/actions there is a static.yml which could be used to serve the repo as a webpage using github pages - remember to add the ![query paramenters](https://web.archive.org/web/20240320115535/https://static.semrush.com/blog/uploads/media/13/c0/13c06b986a5d05abb45c36bf345ea964/original.png) to the URL