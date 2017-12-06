# Unity public api

### Data
- [ ] .register_value()
- [ ] .rerun_pipelines()


### Blocks
- [ ] .subscribe_to_pipeline()
- [ ] .unsubscribe_from_pipeline()

Do we need a method to get a single value out for display or can .subscribe_to_pipeline() also take an id to a single number?


# Outside of Unity (could be vuex)

### Configuration
- [ ] .register_configuration()
- [ ] .get_configuration()


## Pipelines to calculate `sprayed_count` and `coverage_%`

### Start with:
  - `@responses` (fields: `response_id`, `sprayed_rooms`, `village_id`, `district_id`)
  - `@targets` (fields: `targeted_rooms`, `village_id`, `district_id`, `geom`)

### Can change:
1. `filter `: either for `village_id` or `district_id`
2. `aggregation_level`: select either at village (default) or district
  
### Need to produce:

1. Table: village_id/district_id, target_count, sprayed_count, coverage_%
2. Map: `FeatureCollection` version of the table
  
### 5 cases, 5 pipelines

1. No filter, aggregate at village
2. No filter, aggregate at district
3. Filter at village, aggregate at village
4. Filter at district, aggregate at village
5. Filter at village, aggregate at district
6. Filter at district, aggregate at district

  
### General pipeline
  
**Create the denominator (targeted_rooms)**

  - filter @targets -> match the filter
  - reduce @targets -> group_by+reduce to match the aggregation_level 
  - reduce @targets -> calc total_targeted_rooms for each reduced row -> store
  
**Create the enumerator (sprayed_rooms)**

  - filter @responses -> match the filter
  - reduce @responses -> match aggregation level ('binned responses')
  - reduce @responses -> calculate `sprayed_count`

**Calculate the coverage_%**
  - map @responses with stored denominator ->
      `coverage_% = row.sprayed_count / lookup(row, total_targeted_rooms)`
 