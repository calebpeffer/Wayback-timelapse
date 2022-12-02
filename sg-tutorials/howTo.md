 
13.Once the previous variables are stored, we need to create two more. The first one is the startIndex, which should be set to 0 as our starting position. We should also create a folder for storing our screenshots. For this, we can use the screenshotFolderName variable and set it to `screenshots-${outputFileName}`, where the outputFileName will be whatever you previously defined.

```const startIndex = 0; 
const screenshotFolderName = `screenshots-${outputFileName}"
```

14.Next, we have to create the file path where our screenshots will be saved. To do this, we will use the following code:

```let fullPathToSaveScreenshots = path.join(outputFolderName, screenshotFolderName);```

15.Now, we need to set the options for our automation. This includes the maximum number of captures, the start and end year and the start index. We can use the previously stored variables and set the options as follows:

```let automationOptions = {
    maxCaptures: maxNumberOfCaptures,
    startYear: startYear,
    endYear: endYear,
    index: startIndex
  };```

16.Finally, we have to start the automation with the set configurations and the previously defined options.