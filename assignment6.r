sd <- read.csv("c:/projects/datasci_course_materials/assignment6/seattle_incidents_summer_2014.csv")
sm <- summary(sd)

sub <- sd[c('Month', 'District.Sector', 'Summary.Offense.Code', 'Occurred.Date.or.Date.Range.Start')]
library(RJSONIO)    
writeLines(toJSON(sub), "subset.JSON")
