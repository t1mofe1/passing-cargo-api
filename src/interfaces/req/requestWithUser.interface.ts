import { FastifyRequest } from 'fastify';
import User from '../../models/User.model';

interface RequestWithUser extends FastifyRequest {
  user: User;
}

export default RequestWithUser;
