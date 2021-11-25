using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using backend.Models;

namespace backend.Helpers
{
    public class AuthorizedAttribute : AuthorizeAttribute
    {
        public AuthorizedAttribute(params UserRole[] roles) : base() {
            var rolesNames = new List<string>();
            var names = Enum.GetNames(typeof(UserRole));
            foreach (var role in roles) {
                rolesNames.Add(names[(int)role]);
            }
            Roles = String.Join(",", rolesNames);
        }
    }
}
