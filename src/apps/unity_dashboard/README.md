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


# Pipeline setup


### Calculating and saving targets for later

Raw target:
{num_rooms, district, village, id, name}

Targets at district level:
  step: group_by district
  step: for each group, reduce num_rooms
  step: join reduced num_rooms to each group
  return all groups

Targets at village level:
  return raw targets


### Use targets in pipeline (calculate coverage)
Raw response:
{structures_sprayed, village_id}

Coverage for village"
  step: join targets (by village) & responses (by village_id)
  step: map (add_field coverage) 'structures_sprayed / num_rooms'
  return after mapping
