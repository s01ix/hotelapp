import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, User as UserIcon, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useApp } from '../context/AppContext';
import { User, fetchAllUsers, updateUserRole } from '../components/service/api';
import { useTranslation } from 'react-i18next';

export const AdminUserPanel: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsersList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      alert(t('adminUserPanel.errors.changeRole'));
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role.toUpperCase()) {
      case 'ADMIN': return <Shield className="h-4 w-4 text-red-500" />;
      case 'RECEPTIONIST': return <Briefcase className="h-4 w-4 text-accent" />;
      default: return <UserIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <Button onClick={() => navigate('/admin')} variant="ghost" className="mb-6 hover:text-accent p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-xs uppercase tracking-widest">{t('adminUserPanel.backToAdminPanel')}</span>
          </Button>
          <h1 className="text-4xl font-serif mb-2">{t('adminUserPanel.title')}</h1>
          <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px]">{t('adminUserPanel.subtitle')}</p>
        </div>

        {isLoading ? (
          <p className="text-center py-10 text-gray-500">{t('adminUserPanel.loading')}</p>
        ) : (
          <div className="bg-white border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-100">
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('adminUserPanel.table.id')}</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('adminUserPanel.table.email')}</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('adminUserPanel.table.name')}</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{t('adminUserPanel.table.currentRole')}</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">{t('adminUserPanel.table.changeRoleTo')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.map((u) => {
                  const isMe = u.id === user?.id;

                  return (
                    <TableRow key={u.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                      <TableCell className="text-[10px] font-mono text-gray-400">#{u.id}</TableCell>
                      <TableCell className="font-medium text-sm text-gray-700">{u.email}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{u.name || '---'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                          {getRoleIcon(u.role)}
                          {u.role}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isMe ? (
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300 italic pr-4">
                            {t('adminUserPanel.yourAccount')}
                          </span>
                        ) : (
                          <>
                            <Button 
                              onClick={() => handleRoleChange(u.id, 'USER')} 
                              variant="outline" 
                              disabled={u.role.toUpperCase() === 'USER'}
                              className="text-[10px] h-7 px-2"
                            >
                              USER
                            </Button>
                            <Button 
                              onClick={() => handleRoleChange(u.id, 'RECEPTIONIST')} 
                              variant="outline" 
                              disabled={u.role.toUpperCase() === 'RECEPTIONIST'}
                              className="text-[10px] h-7 px-2 border-accent text-accent hover:bg-accent hover:text-white"
                            >
                              RECEPCJONISTA
                            </Button>
                            <Button 
                              onClick={() => handleRoleChange(u.id, 'ADMIN')} 
                              variant="outline" 
                              disabled={u.role.toUpperCase() === 'ADMIN'}
                              className="text-[10px] h-7 px-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              ADMIN
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};