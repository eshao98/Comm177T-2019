## Data viz tool exercise
Elena Shao  
COMM 177T: Building News Applications

### The Data Visualization

Because I'm currently working on a project to look at campaign contributions (over time) from Stanford affiliates, I wanted to use a summary data set I had collected from [Open Secrets](https://www.opensecrets.org/orgs/toprecips.php?id=D000000750&cycle=2018) (actually using the BeautifulSoup parsing activity from last quarter!) to see what visualization I could come up with to help me along on the project. Here, I started with total contribution data over the years, though I definitely plan to break this down further, since I have data from exactly where campaign contributions went to and where they came from.

For the Datawrapper data visualization, I showed the proporation of contributions going to each party. For the Flourish version, I was able to use the same data to create something closer to what I wanted, which was to show total contribution (in raw amounts) because the nature of a stacked bar chart already showcases proportion (the Datawrapper chart, then, is sort of redundant).

### Flourish, Datawrapper.de

Since I had worked a little with Flourish before, I decided to start with Datawrapper. Immediately, I was excited to see that during the data uploading process, Datawrapper had a step to check that it had interpreted the data correctly, an option that I haven't found on Flourish. The interface even color-codes dates in green, text in black, numbers in blue, and draws attention to cells with missing data. I've definitely faced obstacles on Flourish with mis-interpreted data, so I appreciated this touch. 

For simpler data visualizations, Datawrapper also seems to do a better job with its first shot at interpreting data. For example, with essentially no other input or direction besides uploading the data, Datawrapper was able to pretty much correctly map out the campaign contribution data:

![dataviz2](https://github.com/eshao98/Comm177T-2019/blob/master/_site/executions/dataviz2.png)

While Flourish had trouble interpreting % to Democrats to be the same as # of Democrats, and double-counted those values, and even interpreted the "Total" column incorrectly:

![dataviz1](https://github.com/eshao98/Comm177T-2019/blob/master/_site/executions/dataviz1.png)

Another aspect of Datawrapper that I preferred over Flourish was that they ask for your data first, and then give you options to cycle through different visualizations. When I opened Flourish to try and complete the same task, the site asked me to first choose the "type" of visualization I wanted first. This can be changed later, but even a subtle touch such as this actually makes a huge difference in ease of choosing the right visualization, especially when working with more obscure data that I may not have a concrete idea of what it should look like at the start. 

However, a huge issue with using Datawrapper was that it couldn't recognize a the dollar amounts as numbers. Flourish did this easily. This meant that my Datawrapper chart showcased proportion of donations, and not raw amount of contributions. I would have liked a feature that would allow me to link data points and show the total on hover. 

Both tools also had options to customize the colors; on Datawrapper this option was to "highlight" the most important column, and on Flourish there is a bit more flexibility with the "override" function. Overall, Flourish was less user-friendly, though this might be due to the fact that it seems to offer more customization. Along these lines, I could tell from the customization options &mdash; including options to edit popups, annotations, search/filter functions, and animations &mdash; that Flourish was definitely built with interactivity in mind. 