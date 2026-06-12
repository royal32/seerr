import { UserType } from '@server/constants/user';
import dataSource, { getRepository } from '@server/datasource';
import { User } from '@server/entity/User';
import { Permission } from '@server/lib/permissions';
import { getSettings } from '@server/lib/settings';
import gravatarUrl from 'gravatar-url';

// docker compose exec -T seerr pnpm setup:local-admin

const email = process.env.LOCAL_ADMIN_EMAIL ?? 'admin';
const password = process.env.LOCAL_ADMIN_PASSWORD ?? 'adminadmin';
const username = process.env.LOCAL_ADMIN_USERNAME ?? 'admin';
const initialize = process.env.LOCAL_ADMIN_INITIALIZE !== 'true';

const setupLocalAdmin = async () => {
  await dataSource.initialize();

  const userRepository = getRepository(User);
  let user = await userRepository.findOne({ where: { email } });

  if (!user) {
    user = new User({
      email,
      avatar: gravatarUrl(email, { default: 'mm', size: 200 }),
    });
  }

  user.username = username;
  user.userType = UserType.LOCAL;
  user.permissions = Permission.ADMIN;
  await user.setPassword(password);
  await userRepository.save(user);

  if (initialize) {
    const settings = await getSettings().load();
    settings.public.initialized = true;
    await settings.save();
  }

  console.log(`Local admin ready: ${user.email}`);
  console.log(`Seerr initialized: ${initialize}`);
};

setupLocalAdmin()
  .catch((error) => {
    console.error('Failed to set up local admin:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
