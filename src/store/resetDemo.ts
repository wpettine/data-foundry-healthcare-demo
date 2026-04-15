import { usePAStore } from './paStore';
import { useSchemaStore } from './schemaStore';
import { useModelStore } from './modelStore';
import { useAnnotationStore } from './annotationStore';
import { useSourcesStore } from './sourcesStore';
import { useKPIStore } from './kpiStore';

export function resetAllStores() {
  usePAStore.getState().reset();
  useSchemaStore.getState().reset();
  useModelStore.getState().reset();
  useAnnotationStore.getState().reset();
  useSourcesStore.getState().reset();
  useKPIStore.getState().reset();
}
