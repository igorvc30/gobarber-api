import 'reflect-metadata';
import app from '@shared/infra/http/app';
import '@shared/infra/typeorm';
import '@shared/container';

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
